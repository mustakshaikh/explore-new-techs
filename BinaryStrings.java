import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BinaryStrings {
    public static void main(String args[]) {
        List<String> strBinaryWords=new ArrayList<>();
        strBinaryWords=binarystringhelper(3);
        for(String str:strBinaryWords){
            System.out.println(str);
        }
    }
    
    public static List<String> binarystringhelper(int num){
        List<String> strPattern=Arrays.asList("0","1");
        List<String> strPrev;
        List<String> result=new ArrayList<>();
        if(num==1)
            return strPattern;
        strPrev=binarystringhelper(num -1);
        for(String str:strPrev){
            result.add(str + "0");
            result.add(str + "1");
        }
        return result;
    }
}
