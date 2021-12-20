import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class RegularStrings {
    public static void main(String args[]) {
        List<String> strBinaryWords=new ArrayList<>();
        strBinaryWords=binarystringhelper(2);
        for(String str:strBinaryWords){
            System.out.println(str);
        }
    }
    
    public static List<String> binarystringhelper(int num){
        List<String> strPattern=new ArrayList<>();;
        for(int i=0;i <=25;i++)
            strPattern.add(Character.toString(97+i));
        List<String> strPrev;
        List<String> result=new ArrayList<>();
        if(num==1)
            return strPattern;
        strPrev=binarystringhelper(num -1);
        for(String str:strPrev){
            for(String str1:strPattern)
            {
                result.add(str + str1);
            }
        }
        return result;
    }
}
